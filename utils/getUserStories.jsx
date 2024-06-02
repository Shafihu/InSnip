import avatar1 from '../assets/avatars/avatar_1.png';
import avatar2 from '../assets/avatars/avatar_11.png';
import avatar3 from '../assets/avatars/avatar_3.webp';
import avatar4 from '../assets/avatars/avatar_4.webp';
import avatar5 from '../assets/avatars/avatar_5.png';
import avatar6 from '../assets/avatars/avatar_6.png';
import avatar7 from '../assets/avatars/avatar_7.jpg';
import avatar8 from '../assets/avatars/avatar_8.jpg';
import avatar9 from '../assets/avatars/avatar_9.png';
import avatar10 from '../assets/avatars/avatar_10.webp';


const getUserStories = () => {
  const stories = [
    {
      id: 1,
      avatar: avatar5,
      nickName: 'felix😎',
      userName: 'felix253726',
    },
    {
      id: 2,
      avatar: avatar2,
      nickName: 'Alice😈💕',
      userName: 'alice93726',
    },
    {
      id: 3,
      avatar: avatar3,
      nickName: 'Bob💫✨',
      userName: 'bob19273',
    },
    {
      id: 4,
      avatar: avatar4,
      nickName: 'charlie',
      userName: 'charlie84736',
    },
    {
      id: 5,
      avatar: '',
      nickName: 'Christabel🤑💵',
      userName: 'david37283',
    },
    {
      id: 6,
      avatar: avatar6,
      nickName: 'emma',
      userName: 'emma28472',
    },
    {
      id: 7,
      avatar: avatar7,
      nickName: 'Frank🎮',
      userName: 'frank19382',
    },
    {
      id: 8,
      avatar: avatar8,
      nickName: 'Grace',
      userName: 'grace83726',
    },
    {
      id: 9,
      avatar: avatar9,
      nickName: 'harry',
      userName: 'harry92837',
    },
    {
      id: 10,
      avatar: avatar10,
      nickName: '🎶Isabel😘😎',
      userName: 'isabel92837',
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stories);
    }, 1000);
  });
};

export default getUserStories;
