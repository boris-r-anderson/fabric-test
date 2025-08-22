export interface RecordResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface RecordList {
  Search: Array<RecordResult>
  totalResults: number
  Response: boolean
}
