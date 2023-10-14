export interface IOpenHoursItem {
  days: 'пн' | 'вт' | 'ср' | 'чт' | 'пт' | 'сб' | 'вс';
  hours: string; // Пример: "09:00-18:00" или "выходной"
  averageHoursTraffic: {
    hour: number; // 9 (означает 9:00)
    trafficValue: number; // Оценка загруженности (количество людей в очереди)
  }[];
}
