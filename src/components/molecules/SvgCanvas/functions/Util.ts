/**
 * イベントIDを生成する
 *
 * @returns イベントID
 */
export const newEventId = (): string => crypto.randomUUID();
