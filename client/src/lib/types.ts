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


export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}