export interface IOpenHours {
  workingDays: {
    start: number;
    end: number;
    averageTraffic: {
      [key: number]: number;
    };
  };
  weekends: {
    start: number;
    end: number;
    averageTraffic: {
      [key: number]: number;
    };
  };
}
