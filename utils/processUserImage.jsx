const processUserImage = (imageName) => {

        switch (imageName) {
          case "user.png":
            return require("../assets/avatars/user.png");
          case "avatar_5.png":
            return require("../assets/avatars/avatar_5.png");
          default:
            return null;
        }

}

export default processUserImage