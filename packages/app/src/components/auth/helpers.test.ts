import { isProtected } from './helpers';
import { Location } from 'react-router-dom';

describe('isProtected function', () => {
  it('should return true for catalog routes', () => {
    const catLoc: Partial<Location> = { pathname: '/catalog' } as Location;
    const catGraphLoc: Partial<Location> = {
      pathname: '/catalog-graph',
    } as Location;
    const settingLoc: Partial<Location> = { pathname: '/settings' } as Location;

    expect(isProtected(catLoc as Location)).toBe(true);
    expect(isProtected(catGraphLoc as Location)).toBe(true);
    expect(isProtected(settingLoc as Location)).toBe(true);
  });

  it('should return true for catalog routes when path has trailing slash', () => {
    const catLoc: Partial<Location> = { pathname: '/catalog/' } as Location;
    const catGraphLoc: Partial<Location> = {
      pathname: '/catalog-graph/',
    } as Location;
    const settingLoc: Partial<Location> = {
      pathname: '/settings/',
    } as Location;

    expect(isProtected(catLoc as Location)).toBe(true);
    expect(isProtected(catGraphLoc as Location)).toBe(true);
    expect(isProtected(settingLoc as Location)).toBe(true);
  });

  it('should return true for a catalog route when path has parameters', () => {
    const catLoc: Partial<Location> = {
      pathname: '/catalog?param=1&param=2',
    } as Location;
    expect(isProtected(catLoc as Location)).toBe(true);
  });

  it('should return true for a catalog route when path has sub path', () => {
    const catLoc: Partial<Location> = {
      pathname: '/catalog/some/other/place',
    } as Location;
    const catGraphLoc: Partial<Location> = {
      pathname: '/catalog-graph/other/',
    } as Location;
    expect(isProtected(catLoc as Location)).toBe(true);
    expect(isProtected(catGraphLoc as Location)).toBe(true);
  });

  it('should return false for a non catalog route', () => {
    const otherLoc: Partial<Location> = { pathname: '/something' } as Location;
    const otherLocWitSubPath: Partial<Location> = {
      pathname: '/something/over/there',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLocWitSubPath as Location)).toBe(false);
  });

  it('should return false for a route that starts with the same string as a catalog route', () => {
    const otherLoc: Partial<Location> = { pathname: '/setting' } as Location;
    const otherLoc2: Partial<Location> = {
      pathname: '/catalog-grapha',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLoc2 as Location)).toBe(false);
  });

  it('should return false for a route that starts with the same string as a catalog route and has params', () => {
    const otherLoc: Partial<Location> = {
      pathname: '/setting?param=1',
    } as Location;
    const otherLoc2: Partial<Location> = {
      pathname: '/catalog-grapha?x=7&y=abc',
    } as Location;
    expect(isProtected(otherLoc as Location)).toBe(false);
    expect(isProtected(otherLoc2 as Location)).toBe(false);
  });

  it('should return false for the root route', () => {
    const rootLoc: Partial<Location> = { pathname: '/' } as Location;
    expect(isProtected(rootLoc as Location)).toBe(false);
  });
});
