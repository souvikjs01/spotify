import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Album, Song } from "../lib/types";
import axios from "axios";
// const server = "http://13.201.49.225";
const server = "http://localhost:8080";


interface SongContextType {
  songs: Song[];
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setSelectedSong: (id: string) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  song: Song | null;
  nextSong: () => void;
  prevSong: () => void;
  fetchAlbumsongs: (id: string) => Promise<void>;
  albumSongs: Song[];
  albumData: Album | null;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
}

const SongContext = createContext<SongContextType | undefined>(undefined)

interface SongProviderProps {
    children: React.ReactNode
}


export const SongProvider: React.FC<SongProviderProps> = ({children}) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSong, setSelectedSong] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [song, setSong] = useState<Song | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
    const [albumData, setAlbumData] = useState<Album | null>(null);



    const fetchSongs = useCallback(async () => {
        try {
            const { data } = await axios.get<Song[]>(`${server}/api/v2/song/all`);
            setSongs(data);
            if(data.length > 0) {
                setSelectedSong(data[0].id.toString())
            }
            setIsPlaying(false)
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false)
        }
    }, [])

    const fetchAlbums = useCallback(async () => {
        try {
            const { data } = await axios.get<Album[]>(`${server}/api/v2/album/all`);
            setAlbums(data)
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false)
        }
    }, [])

    const nextSong = useCallback(() => {
        if(index === songs.length - 1) {
            setIndex(0)
            setSelectedSong(songs[0].id.toString())
        } else {
            setIndex(prev => prev + 1);
            setSelectedSong(songs[index+1].id.toString());
        }
    }, [index, song]);

    const prevSong = useCallback(() => {
        if(index > 0) {
            setIndex(prev => prev - 1);
            setSelectedSong(songs[index - 1].id.toString())
        } 
    }, [index, song]);


    const fetchSingleSong = useCallback(async () => {
        try {
            if(!selectedSong) return;
            const { data } = await axios.get<Song>(`${server}/api/v2/song/${selectedSong}`);
            setSong(data)
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false)
        }
    }, [selectedSong]);

    const fetchAlbumsongs = useCallback(async (id: string) => {
        try {
            const { data } = await axios.get<{songs: Song[]; album: Album}>(`${server}/api/v2/album/${id}`);
            console.log(data);
            setAlbumSongs(data.songs);
            setAlbumData(data.album);        
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSongs()
        fetchAlbums()
    }, [])

    return (
        <SongContext.Provider 
            value={{ 
                songs, 
                albums, 
                fetchAlbums,
                fetchSongs,
                isPlaying, 
                loading, 
                selectedSong, 
                setSelectedSong, 
                setIsPlaying ,
                fetchSingleSong,
                song,
                nextSong,
                prevSong,
                fetchAlbumsongs,
                albumData,
                albumSongs,
            }}    
        >
            {children}
        </SongContext.Provider>
    )
}

export const useSongData = (): SongContextType => {
    const context = useContext(SongContext);
    if(!context) {
        throw new Error("useSongContext must be used within a songProvider");
    }
    return context
}