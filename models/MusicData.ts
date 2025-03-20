export interface Artist {
  id: string;
  name: string;
  imageUri: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  releaseDate: string;
  imageUri: string;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number; // in seconds
  uri: string;
  imageUri: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  songs: Song[];
}

export const artists: Artist[] = [
  {
    id: 'artist1',
    name: 'Kendrick Lamar',
    imageUri: 'https://i.scdn.co/image/ab6761610000517439ba6dcd4355c03de0b50918',
  },
  {
    id: 'artist2',
    name: 'Kanye West',
    imageUri: 'https://i.scdn.co/image/ab676161000051746e835a500e791bf9c27a422a',
  },
  {
    id: 'artist3',
    name: 'Travis Scott',
    imageUri: 'https://i.scdn.co/image/ab6761610000517419c2790744c792d05570bb71',
  },
  {
    id: 'artist4',
    name: 'Playboi Carti',
    imageUri: 'https://i.scdn.co/image/ab67616100005174ba50ca67ffc3097f6ea1710a',
  },
  {
    id: 'artist5',
    name: 'Tyler, The Creator',
    imageUri: 'https://i.scdn.co/image/ab67616100005174dfa2b0c7544a772042a12e52',
  },
];

// Updated Albums for the specified artists
export const albums: Album[] = [
  {
    id: 'album1',
    title: 'DAMN.',
    artist: artists[0], // Kendrick Lamar
    releaseDate: '2017-04-14',
    imageUri: 'https://i.scdn.co/image/ab67616d00001e028b52c6b9bc4e43d873869699',
  },
  {
    id: 'album2',
    title: 'The Life of Pablo',
    artist: artists[1], // Kanye West
    releaseDate: '2016-02-14',
    imageUri: 'https://i.scdn.co/image/ab67616d00001e022a7db835b912dc5014bd37f4',
  },
  {
    id: 'album3',
    title: 'ASTROWORLD',
    artist: artists[2], // Travis Scott
    releaseDate: '2018-08-03',
    imageUri: 'https://i.scdn.co/image/ab67616d00001e02072e9faef2ef7b6db63834a3',
  },
  {
    id: 'album4',
    title: 'Whole Lotta Red',
    artist: artists[3], // Playboi Carti
    releaseDate: '2020-12-25',
    imageUri: 'https://i.scdn.co/image/ab67616d00001e0298ea0e689c91f8fea726d9bb',
  },
  {
    id: 'album5',
    title: 'IGOR',
    artist: artists[4], // Tyler, The Creator
    releaseDate: '2019-05-17',
    imageUri: 'https://i.scdn.co/image/ab67616d00001e027005885df706891a3c182a57',
  },
];

// Updated Songs for the specified artists and albums
export const songs: Song[] = [
  {
    id: 'song1',
    title: 'HUMBLE.',
    artist: artists[0], // Kendrick Lamar
    album: albums[0], // DAMN.
    duration: 177, // 2:57
    uri: 'http://truenas.local:42069/ok/08%20-%20Kendrick%20Lamar%20-%20HUMBLE(Explicit).m4a',
    imageUri: albums[0].imageUri,
  },
  {
    id: 'song2',
    title: 'DNA.',
    artist: artists[0], // Kendrick Lamar
    album: albums[0], // DAMN.
    duration: 185, // 3:05
    uri: 'http://truenas.local:42069/ok/02%20-%20Kendrick%20Lamar%20-%20DNA(Explicit).m4a',
    imageUri: albums[0].imageUri,
  },
  {
    id: 'song3',
    title: 'Famous',
    artist: artists[1], // Kanye West
    album: albums[1], // The Life of Pablo
    duration: 196, // 3:16
    uri: 'http://truenas.local:42069/ok/04%20-%20Kanye%20West%20-%20Famous(Explicit).m4a',
    imageUri: albums[1].imageUri,
  },
  {
    id: 'song4',
    title: 'Ultralight Beam',
    artist: artists[1], // Kanye West
    album: albums[1], // The Life of Pablo
    duration: 321, // 5:21
    uri: 'http://truenas.local:42069/ok/01%20-%20Kanye%20West%20-%20Ultralight%20Beam(Explicit).m4a',
    imageUri: albums[1].imageUri,
  },
  {
    id: 'song5',
    title: 'SICKO MODE',
    artist: artists[2], // Travis Scott
    album: albums[2], // ASTROWORLD
    duration: 312, // 5:12
    uri: 'http://truenas.local:42069/ok/03%20-%20Travis%20Scott%20-%20SICKO%20MODE(Explicit).m4a',
    imageUri: albums[2].imageUri,
  },
  {
    id: 'song6',
    title: 'STARGAZING',
    artist: artists[2], // Travis Scott
    album: albums[2], // ASTROWORLD
    duration: 270, // 4:30
    uri: 'http://truenas.local:42069/ok/01%20-%20Travis%20Scott%20-%20STARGAZING(Explicit).m4a',
    imageUri: albums[2].imageUri,
  },
  {
    id: 'song7',
    title: 'Sky',
    artist: artists[3], // Playboi Carti
    album: albums[3], // Whole Lotta Red
    duration: 193, // 3:13
    uri: 'http://truenas.local:42069/ok/19%20-%20Playboi%20Carti%20-%20Sky(Explicit).m4a',
    imageUri: albums[3].imageUri,
  },
  {
    id: 'song8',
    title: 'New Tank',
    artist: artists[3], // Playboi Carti
    album: albums[3], // Whole Lotta Red
    duration: 117, // 1:57
    uri: 'http://truenas.local:42069/ok/09%20-%20Playboi%20Carti%20-%20New%20Tank(Explicit).m4a',
    imageUri: albums[3].imageUri,
  },
  {
    id: 'song9',
    title: 'EARFQUAKE',
    artist: artists[4], // Tyler, The Creator
    album: albums[4], // IGOR
    duration: 190, // 3:10
    uri: 'http://truenas.local:42069/ok/02%20-%20Tyler,%20The%20Creator%20-%20EARFQUAKE(Explicit).m4a',
    imageUri: albums[4].imageUri,
  },
  {
    id: 'song10',
    title: 'NEW MAGIC WAND',
    artist: artists[4], // Tyler, The Creator
    album: albums[4], // IGOR
    duration: 195, // 3:15
    uri: 'http://truenas.local:42069/ok/06%20-%20Tyler,%20The%20Creator%20-%20NEW%20MAGIC%20WAND(Explicit).m4a',
    imageUri: albums[4].imageUri,
  },
];

// Updated Playlists with the new songs
export const playlists: Playlist[] = [
  {
    id: 'playlist1',
    name: 'Rap Workout',
    description: 'High-energy rap tracks for your workout session',
    imageUri: 'https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320',
    songs: [songs[0], songs[2], songs[4], songs[6]],
  },
  {
    id: 'playlist2',
    name: 'Chill Hip-Hop',
    description: 'Laid-back hip-hop tracks to vibe to',
    imageUri: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e',
    songs: [songs[1], songs[3], songs[8], songs[9]],
  },
  {
    id: 'playlist3',
    name: 'Party Bangers',
    description: 'Top hip-hop hits to get the party started',
    imageUri: 'https://i.scdn.co/image/ab67706f000000035f55822e40d8d2b375c07091',
    songs: [songs[0], songs[4], songs[6], songs[8]],
  },
  {
    id: 'playlist4',
    name: 'Rap Road Trip',
    description: 'Perfect rap soundtrack for your journey',
    imageUri: 'https://i.scdn.co/image/ab67706f000000036bd0bcddd7f0c8c4e4316c3e',
    songs: [songs[2], songs[5], songs[7], songs[9]],
  },
];