import axios from 'axios';
import { NextPage } from 'next';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';
import { BASE_URL } from '../utils';
import { useEffect } from 'react';
import { useState } from 'react';

interface IProps {
  videos: Video[];
}

const Home: NextPage<IProps> = ({ videos }) => {
  const [videosPreview, setVideosPreview] = useState(videos);

  const handleVideosUpdate = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/post`);
    setVideosPreview(data);
  };

  useEffect(() => {
    handleVideosUpdate();
  }, [handleVideosUpdate]);

  return (
    <div className='flex flex-col gap-10 videos h-full'>
      {videosPreview.length ? videosPreview.map((video: Video) => <VideoCard post={video} key={video._id} />) : <NoResults text={'No Videos'} />}
    </div>
  );
};

export const getServerSideProps = async ({ query: { topic } }: { query: { topic: string } }) => {
  let response = null;

  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${BASE_URL}/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
