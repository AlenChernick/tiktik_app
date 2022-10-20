import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import useAuthStore from '../store/authStore';
import NoResults from './NoResults';
import { NextPage } from 'next';
import { IUser } from '../types';

interface IProps {
  isPostingComment: boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments: NextPage<IProps> = ({ comment, setComment, addComment, comments, isPostingComment }) => {
  const { userProfile, allUsers } = useAuthStore();

  return (
    <div className='border-t-2 border-gray-200 pt-4 px-5 bg-[#F8F8F8] border-b-2 lg:pb-0 pb[100px]'>
      <div className='overflow-scroll lg:h-[550px]'>
        {comments?.length ? (
          comments?.map((item: IComment, idx: number) => (
            <>
              {allUsers?.map(
                (user: IUser) =>
                  user._id === (item.postedBy._id || item.postedBy._ref) && (
                    <div className='p-2 items-center' key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className='flex items-start gap-3'>
                          <div className='w-8 h-8'>
                            <Image src={user.image} width={34} height={34} className='rounded-full' alt='user profile' layout='responsive' />
                          </div>
                          <div className='xl:block mt-[-2px]'>
                            <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                              {user.userName.replaceAll(' ', '')}
                              <GoVerified className='text-blue-400' />
                            </p>
                            <p className='capitalize text-gray-400 text-xs'>{user.userName}</p>
                          </div>
                        </div>
                      </Link>
                      <div className='mt-1 ml-11 text-[16px] mr-8'>
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </>
          ))
        ) : (
          <NoResults text='No comments yet' />
        )}
      </div>
      {userProfile && (
        <div className='lg:absolute lg:bottom-0 pb-6 px-2 md:px-10'>
          <form onSubmit={addComment} className='flex gap-4'>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Add comment...'
              className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
            />
            <button className='text-md lg:text-xl text-gray-400 ml-1 lg:ml-14 hover:text-black' onClick={addComment}>
              {isPostingComment ? 'Commenting' : 'Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;
