export interface IReservationDto {
  _id?: string,
  user: string,
  date: string,
  time: string,
  desc?: string,
  guests: number,
  table_id: string
}

export interface ITableDto {
  _id?: string,
  name: string,
  capacity: number,
  min: number,
}
