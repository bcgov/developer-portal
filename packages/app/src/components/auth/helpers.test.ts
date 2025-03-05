import { isProtected } from './helpers';
import { Location } from 'react-router-dom';

describe('isProtected function', () => {
  it('should return true for settings and catalog-import routes', () => {
    const settingLoc: Partial<Location> = { pathname: '/settings' } as Location;
    const catLoc: Partial<Location> = {
      pathname: '/catalog-import',
    } as Location;

    expect(isProtected(catLoc as Location)).toBe(true);
    expect(isProtected(settingLoc as Location)).toBe(true);
  });

  it('should return true for settings and catalog-import routes when path has trailing slash', () => {
    const settingLoc: Partial<Location> = {
      pathname: '/settings/',
    } as Location;
    const catLoc: Partial<Location> = {
      pathname: '/catalog-import/',
    } as Location;
    expect(isProtected(settingLoc as Location)).toBe(true);
    expect(isProtected(catLoc as Location)).toBe(true);
  });

  it('should return false for a a generic route', () => {
    const otherLoc: Partial<Location> = { pathname: '/something' } as Location;
    const otherLocWitSubPath: Partial<Location> = {
      pathname: '/something/over/there',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLocWitSubPath as Location)).toBe(false);
  });

  it('should return false for a route that starts with the same string as the settings or catalog-import route', () => {
    const otherLoc: Partial<Location> = { pathname: '/setting' } as Location;
    const otherLoc2: Partial<Location> = {
      pathname: '/catalog-impor',
    } as Location;
    const otherLoc3: Partial<Location> = {
      pathname: '/catalog-importa',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLoc2 as Location)).toBe(false);
    expect(isProtected(otherLoc3 as Location)).toBe(false);
  });

  it('should return false for a route that starts with the same string as the settings or catalog-import route and has params', () => {
    const otherLoc: Partial<Location> = {
      pathname: '/sett?param=1',
    } as Location;
    const otherLoc2: Partial<Location> = {
      pathname: '/catalog-impor?x=7&y=abc',
    } as Location;
    const otherLoc3: Partial<Location> = {
      pathname: '/catalog-importa?x=7&y=abc',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLoc2 as Location)).toBe(false);
    expect(isProtected(otherLoc3 as Location)).toBe(false);
  });

  it('should return false for the root route', () => {
    const rootLoc: Partial<Location> = { pathname: '/' } as Location;
    expect(isProtected(rootLoc as Location)).toBe(false);
  });
});
