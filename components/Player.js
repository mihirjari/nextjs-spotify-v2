import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"

function Player() {

    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);

    const [mute, isMute] = useState(false);

    const songInfo = useSongInfo();

    //Skip to previous song
    const previousSong = () => {
        
            spotifyApi.skipToPrevious().then(() => {

                spotifyApi.getMyCurrentPlayingTrack().then((data) => {

                    setCurrentTrackId(data.body?.item?.id);

                    spotifyApi.getMyCurrentPlaybackState().then((data) => {

                        setIsPlaying(data.body?.is_playing);
                    });

                });
            })
       }

      


    const fetchCurrentSong = () => {

        if(!songInfo){

            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {

                    setIsPlaying(data.body?.is_playing);
                })
            });
        }
    }

    //Skip to next song
    const nextSong = () => {

        spotifyApi.skipToNext().then(() => {

            spotifyApi.getMyCurrentPlayingTrack().then((data) => {

                setCurrentTrackId(data.body?.item?.id);

                    spotifyApi.getMyCurrentPlaybackState().then((data) => {

                        setIsPlaying(data.body?.is_playing);
                    });

            });
        });
    }

    useEffect(() => {

        if(spotifyApi.getAccessToken() && !currentTrackId){

            //If no track id is set then fetch song info

            fetchCurrentSong();
            setVolume(50);
        }

    }, [currentTrackId, spotifyApi, session]);

    const handlePlayPause = () => {

        spotifyApi.getMyCurrentPlaybackState().then((data) => {

            if(data.body.is_playing){

                spotifyApi.pause();
                setIsPlaying(false);
            }else{
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {

        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }

    }, [volume]);

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {console.log(err)})
        }, 500), []
    );

   


  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">

        {/* LEFT SIDE */}
        
        <div className="flex items-center space-x-4">

            <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt={songInfo?.name} />

            <div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            </div>

        </div>

        {/* LEFT SIDE */}

        {/* CENTER SIDE */}

            <div className="flex items-center justify-evenly">
                

                <RewindIcon aria-label="Rewind song" className="button" onClick={previousSong} />

                {
                    isPlaying ? (
                        <PauseIcon aria-label="Pause current song" className="button w-10 h-10" onClick={handlePlayPause} />
                    ) : (
                        <PlayIcon aria-label="Play current song" className="button w-10 h-10" onClick={handlePlayPause} />
                    )
                }
                <FastForwardIcon onClick={nextSong} aria-label="Fast forward current song" className="button" />

               
            </div>

        {/* CENTER SIDE */}


        {/* RIGHT SIDE */}

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                

                {
                    mute ? (

                        <VolumeOffIcon className="button" onClick={() => {
                            isMute(false);
                            spotifyApi.setVolume(50);
                            setVolume(50);
                        }} />

                    ) : (

                        <VolumeUpIcon className="button" onClick={() => {
                            isMute(true);
                            spotifyApi.setVolume(0);
                            setVolume(0);
                        }} />

                    )
                }

                <input style={{accentColor: "#1DB954"}} className="w-14 md:w-28" type="range" value={volume} onChange={(e) => {setVolume(Number(e.target.value))}} min={0} max={100} />
            </div>

        {/* RIGHT SIDE */}



    </div>
  )
}

export default Player