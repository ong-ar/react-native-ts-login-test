import React, { Component } from "react";
import {
  Platform,
  Alert,
  StyleSheet,
  Text,
  View,
  NativeModules
} from "react-native";

// const { RNKakaoLogins } = NativeModules;
import RNKakaoLogins from "react-native-kakao-logins";
import NaverLogin from "react-native-ccs-naver-login";
import NativeButton from "apsl-react-native-button";
import { LoginButton, AccessToken } from "react-native-fbsdk";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '1060901720488-52mb7d0n2ec2p2s2q7f3jsf6v5bu38vj.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export default class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isKakaoLogging: false,
      token: "token has not fetched",
      userInfo: {}
    };
    if (!RNKakaoLogins) {
      console.log("Not Linked");
    }
  }

  // 카카오 로그인 시작.
  kakaoLogin() {
    console.log("   kakaoLogin   ");
    RNKakaoLogins.login((err: any, result: any) => {
      console.log(err, result);
      if (err) {
        console.log("error", err);
        return;
      }
      this.setState({ token: result.token });
      Alert.alert("result", result.token);
    });
  }

  kakaoLogout() {
    console.log("   kakaoLogout   ");
    RNKakaoLogins.logout((err: any, result: any) => {
      if (err) {
        Alert.alert("error", err);
        return;
      }
      Alert.alert("result", result);
    });
  }

  // 로그인 후 내 프로필 가져오기.
  // 네이버 로그인 시작.
  async naverLogin() {
    console.log("  naverLoginStart  ed");
    NaverLogin.login()
      .then(res => {
        this.setState({ token: res.accessToken });
        console.log(res);
      })
      .catch(e => console.log(e));
  }
  
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo, error: null });
      console.log(userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('play services not available or outdated');
      } else {
        Alert.alert('Something went wrong', error.toString());
        this.setState({
          error,
        });
      }
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>LOGIN</Text>
        </View>
        <View style={styles.content}>
          <NativeButton
            isLoading={this.state.isNaverLoggingin}
            onPress={() => this.kakaoLogin()}
            activeOpacity={0.5}
            style={styles.btnKakaoLogin}
            textStyle={styles.txtNaverLogin}
          >
            LOGIN
          </NativeButton>
          <Text>{this.state.token}</Text>
          <NativeButton
            onPress={() => this.kakaoLogout()}
            activeOpacity={0.5}
            style={styles.btnKakaoLogin}
            textStyle={styles.txtNaverLogin}
          >
            Logout
          </NativeButton>
          <NativeButton
            isLoading={this.state.isKakaoLogging}
            onPress={() => this.naverLogin()}
            activeOpacity={0.5}
            style={styles.btnKakaoLogin}
            textStyle={styles.txtNaverLogin}
          >
            Naver Login
          </NativeButton>
          <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data.accessToken.toString());
                });
              }
            }}
            onLogoutFinished={() => console.log("logout.")}
          />
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            disabled={this.state.isSigninInProgress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? 0 : 24,
    paddingTop: Platform.OS === "ios" ? 24 : 0,
    backgroundColor: "white"
  },
  header: {
    flex: 8.8,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flex: 87.5,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  btnKakaoLogin: {
    height: 48,
    width: 240,
    alignSelf: "center",
    backgroundColor: "#F8E71C",
    borderRadius: 0,
    borderWidth: 0
  },
  txtNaverLogin: {
    fontSize: 16,
    color: "#3d3d3d"
  }
});
