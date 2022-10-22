import { NextPage } from 'next';
import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

interface IProps {
  comments: any[];
}

const CommentsButton: NextPage<IProps> = ({ comments }) => {
  return (
    <div className='flex gap-6'>
      <div className='my-4 flex flex-col justify-center items-center cursor-pointer'>
        <div className='bg-primary rounded-full p-2 md:p-3'>
          <FaCommentDots className='text-lg md:text-2xl' />
        </div>
        <p className='text-sm font-semibold text-gray-500'>{comments?.length | 0}</p>
      </div>
    </div>
  );
};

export default CommentsButton;
