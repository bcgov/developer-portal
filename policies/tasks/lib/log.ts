import { createContext, Operation } from "effection";
import { Logger, pino } from "pino";
import { PinoPretty } from "pino-pretty";

export const LogContext = createContext<Logger>("logger", pino(PinoPretty()));

export function* withLogger<T>(name: string, op: () => Operation<T>) {
  const logger = yield* LogContext.expect();
  return yield* LogContext.with<T>(logger.child({ name }), op);
}

export function useLog() {
  return LogContext.expect();
}
