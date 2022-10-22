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
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const videos = document.querySelectorAll<HTMLVideoElement>('.video');

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

  const observer = new IntersectionObserver(
    (entries) => {
      const entry: any = entries[0];

      if (entry.isIntersecting) {
        entry.target.play();
        setPlaying(true);
      } else {
        entry.target.pause();
        setPlaying(false);
      }
    },
    {
      rootMargin: '-5px',
      threshold: 1,
    }
  );

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
      if (router.route === '/profile/[id]') return;
      observer.observe(videoRef.current);
    }
  }, [isVideoMuted]);

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div>
                <Image width={62} height={62} className='rounded-full' src={post.postedBy.image} alt='profile photo' layout='responsive' />
              </div>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div className='lg:flex items-center gap-2 lg:mt-[6px] mt-0 mb-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {post.postedBy.userName} {` `}
                  <GoVerified className='text-blue-400 text-md' />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 md:block'>{post.postedBy.userName}</p>
              </div>
            </Link>
            <Link href={`/detail/${post._id}`}>
              <p className='font-normal ml-[-2.9rem] lg:ml-0'>{post.caption}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-20 flex gap-4 relative'>
        <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className='rounded-3xl'>
          <Link href={`/detail/${post._id}`}>
            <video
              src={post.video.asset.url}
              loop
              id='vid'
              ref={videoRef}
              className='video lg:w-[320px] h-[390px] md:h-[320px] lg:h-[530px] w-[210px] rounded-2xl cursor-pointer bg-black'
            ></video>
          </Link>

          {isHover && (
            <div className='absolute bottom-1  cursor-pointer left-10 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[315px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='text-white drop-shadow-xl text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='text-white drop-shadow-xl text-2xl lg:text-4xl' />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-white drop-shadow-xl text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-white drop-shadow-xl text-2xl lg:text-4xl' />
                </button>
              )}
            </div>
          )}
        </div>
        <div className='relative'>
          {router.pathname === '/' && (
            <>
              <div className=' absolute bottom-[45px] left-[-2px] lg:bottom-[60px]'>
                {userProfile ? (
                  <LikeButton likes={post.likes} handleLike={() => handleLike(true)} handleDislike={() => handleLike(false)} />
                ) : (
                  <LikeButton likes={post.likes} />
                )}
              </div>
              <div className='absolute bottom-[-18px] left-[-2px]'>
                <Link href={`/detail/${post._id}`}>
                  <div>
                    <CommentsButton comments={post.comments} />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
