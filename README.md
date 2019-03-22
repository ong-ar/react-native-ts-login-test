## react native with typescript

### 프로젝트 생성

```
$ npm install -g react-native-cli
$ react-native init 프로젝트명 --template typescript
```

### 개발 환경 (mac 기준)

```
$ brew install node
$ brew install watchman
```

- ios 경우 Xcode 설치
- android 경우 android studio 설치
- 설정: http://facebook.github.io/react-native/docs/getting-started

### kakao login

#### android

- debug 모드 해시 생성 (mac 기준)

```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android | openssl sha1 -binary | openssl base64
```

- release keystore 생성
  https://facebook.github.io/react-native/docs/signed-apk-android

- license 문제 시
```
$ sdkmanager --licenses
```
