const getUserStories = () => {

    const stories = [
        {
          id: 1,
          avatar: '',
          nickName: 'felix',
          userName: 'felix253726',
        },
        {
          id: 2,
          avatar: '',
          nickName: 'alice',
          userName: 'alice93726',
        },
        {
          id: 3,
          avatar: '',
          nickName: 'bob',
          userName: 'bob19273',
        },
        {
          id: 4,
          avatar: '',
          nickName: 'charlie',
          userName: 'charlie84736',
        },
        {
          id: 5,
          avatar: '',
          nickName: 'david',
          userName: 'david37283',
        },
        {
          id: 6,
          avatar: '',
          nickName: 'emma',
          userName: 'emma28472',
        },
        {
          id: 7,
          avatar: '',
          nickName: 'frank',
          userName: 'frank19382',
        },
        {
          id: 8,
          avatar: '',
          nickName: 'grace',
          userName: 'grace83726',
        },
        {
          id: 9,
          avatar: '',
          nickName: 'harry',
          userName: 'harry92837',
        },
        {
          id: 10,
          avatar: '',
          nickName: 'isabel',
          userName: 'isabel92837',
        },
      ];
      
      return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(stories)
        }, 1000)
      })
      
}

export default getUserStories