import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';

import { Video } from '../types';
import LikeButton from './LikeButton';
import useAuthStore from '../store/authStore';
import { BASE_URL } from '../utils';
import axios from 'axios';
import CommentsButton from './CommentsButton';

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post: postPreview }) => {
  const [post, setPost] = useState(postPreview);
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { userProfile }: any = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });
      setPost({ ...post, likes: data.likes });
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${postPreview.postedBy._id}`}>
              <div>
                <Image width={62} height={62} className='rounded-full' src={postPreview.postedBy.image} alt='profile photo' layout='responsive' />
              </div>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${postPreview.postedBy._id}`}>
              <div className='lg:flex items-center gap-2 lg:mt-[6px] mt-0 mb-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {postPreview.postedBy.userName} {` `}
                  <GoVerified className='text-blue-400 text-md' />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 md:block'>{postPreview.postedBy.userName}</p>
              </div>
            </Link>
            <Link href={`/detail/${postPreview._id}`}>
              <p className='font-normal ml-[-2.9rem] lg:ml-0'>{postPreview.caption}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-20 flex gap-4 relative'>
        <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className='rounded-3xl'>
          <Link href={`/detail/${postPreview._id}`}>
            <video
              src={postPreview.video.asset.url}
              loop
              ref={videoRef}
              className='lg:w-[320px] h-[390px] md:h-[320px] lg:h-[530px] w-[210px] rounded-2xl cursor-pointer bg-gray-100'
            ></video>
          </Link>

          {isHover && (
            <div className='absolute bottom-1  cursor-pointer left-10 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[315px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
            </div>
          )}
        </div>
        <div className='relative'>
          <div className=' absolute bottom-[45px] left-[-2px] lg:bottom-[60px]'>
            {userProfile ? (
              <LikeButton likes={postPreview.likes} handleLike={() => handleLike(true)} handleDislike={() => handleLike(false)} />
            ) : (
              <LikeButton likes={postPreview.likes} />
            )}
          </div>
          <div className='absolute bottom-[-18px] left-[-2px]'>
            <Link href={`/detail/${postPreview._id}`}>
              <div>
                <CommentsButton comments={postPreview.comments} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
