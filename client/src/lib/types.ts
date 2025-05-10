export interface Song {
  id:          string;
  title:       string;
  description:  string;
  thumbnail?:   string;
  audio:       string;
  albumId:  string;
}

export interface Album {
  id:          string;
  title:       string;
  description:  string;
  thumbnail:   string;
}