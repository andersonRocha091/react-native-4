import React from 'react';
import moment from 'moment';
import { AsyncStorage } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  StatusBar,
  Button
} from 'react-native';

import { Camera } from 'expo-camera';
import closeButton from '../../assets/close.png';
import * as Permissions from 'expo-permissions';

const profile = {
  "picture": "https://secure.gravatar.com/avatar/f50a9db56e231198af3507f10b5d5491?d=mm",
  "email": "rafael.fuzifaru@gmail.com",
  "first_name": "Rafael",
  "last_name": "Fuzifaru Cianci",
  "phone": "(48) 99110-3535",
  "gender": 1,
  "birthday": "1993-04-27T00:00:00-03:00",
  "linkedin": "https://www.linkedin.com/in/rafaelcianci",
  "github": "http://github.com/rafacianci",
  "address": {
    "Street": "",
    "ZipCode": "",
    "Number": "",
    "ComplementaryAddress": ""
  },
  "language": ["Português - PT", "Inglês - EN", "Japonês - JA"],
  "name": "Rafael Fuzifaru Cianci"
}

export default class Profile extends React.PureComponent {
  fadeAnimation = new Animated.Value(0)

  state = {
    loading: true,
    hasCameraPermission: null,
    openCamera: false,
    type: Camera.Constants.Type.front,
    photo: profile.picture
  }


  async componentDidMount() {
    this.finishLoading()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' })
    try {
      await AsyncStorage.setItem(
        "userImage",
        this.state.photo || profile.picture
      );
    } catch (error) {
      alert("houve um problema ao salvar a foto.");
    }
    this.retrieveProfilePicture();
  }

  componentWillMount() {
    AsyncStorage.getItem("userImage");
  }

  finishLoading = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start()
      this.setState({ loading: false });
    } catch (error) {
      console.error(error)
    }
  }

  takePicture = async () => {
    if (window.camera) {
      let photoData = await window.camera.takePictureAsync({ base64: true });
        try {
        AsyncStorage.setItem('userImage', `data:image/jpg;base64,${photoData.base64}`).then(()=>{
          this.setState({
            openCamera: false,
            photo: `data:image/jpg;base64,${photoData.base64}`
          })
          this.finishLoading()
        })
        } catch (error) {
          console.log(error);
        }
    }
  }

  showCamera = visible => {
    this.setState({ openCamera: visible });
  }

  retrieveProfilePicture = async () => {
    try {
      let takenPicture = await AsyncStorage.getItem('userImage');
      this.setState({ photo: takenPicture ? takenPicture : profile.picture });
    } catch (error) {
      alert('erro ao recuperar a foto!')
    }
  }

  closeCamera = () => {
    setInterval(() => {
      this.setState({
        openCaptures: false
      });
      this.finishLoading();
    }, 600);
  };
  render() {

    let screen = (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            className="header-image"
            style={styles.headerImage}
            source={{
              uri:
                "https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png"
            }}
          />
        </View>
        <View style={styles.profileTitle}>
          <TouchableOpacity
            className="profile-image-btn"
            onPress={() => this.showCamera(true)}
          >
            <Image
              className="profile-image"
              style={styles.profileImage}
              source={{ uri: this.state.photo }}
            />
          </TouchableOpacity>
          <Text className="profile-name" style={styles.profileName}>
            {profile.name}
          </Text>
        </View>
        {this.state.loading && (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#7800ff" />
          </View>
        )}
        {!this.state.loading && (
          <ScrollView>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                Linkedin:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.linkedin}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Github:
              </Text>
              <Text className="contact-value" style={styles.contentText}>
                {profile.github}
              </Text>
            </Animated.View>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                E-mail:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.email}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Celular:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.phone}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Data de Nascimento:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {moment(profile.birthday).format("DD/MM/YYYY")}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Sexo:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.gender === 1 ? "Masculino" : "Feminino"}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Idiomas:
              </Text>
              <View style={styles.languageContent}>
                {profile.language.map(language => (
                  <View key={language} style={styles.language}>
                    <Text
                      className="contact-language"
                      style={styles.languageText}
                    >
                      {language}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        )}
      </View>
    );

    if (this.state.openCamera) {
     screen = (
        <View style={{ flex: 1 }}>
          <StatusBar className="status-bar" hidden={true} />
          <Camera
            className="camera-container"
            style={{ flex: 1 }}
            type={this.state.type}
            ref={(ref) => {
              window.camera = ref;
              window.camera = ref;
            }}
          >
            <TouchableOpacity
              className="camera-close"
              style={styles.cameraClose}
              onPress={() => {
                // this.setState({
                //   openCamera: false
                // });
                // this.finishLoading();
                this.closeCamera();
              }}
            >
              <Image source={require('../../assets/close.png')} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }}
            >
              <TouchableOpacity
                className="camera-shot"
                onPress={() => {
                  this.takePicture()
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Tirar Foto</Text>
              </TouchableOpacity>
            </View>
          </Camera>

        </View>
      )
    }

    return screen;
  }
}

const styles = StyleSheet.create({
  loadingContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#7800ff',
    borderBottomWidth: 2,
    padding: 16,
    paddingTop: 55
  },
  headerImage: {
    height: 45,
    width: 250
  },
  title: {
    color: '#7800ff',
    fontSize: 30,
    padding: 16,
  },
  profileTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16
  },
  profileImage: {
    borderRadius: 22,
    height: 45,
    width: 45
  },
  profileName: {
    color: '#7800ff',
    fontSize: 20,
    paddingLeft: 16
  },
  userContent: {
    backgroundColor: '#000',
    borderRadius: 2,
    margin: 16,
    padding: 16,
    marginTop: 0
  },
  contentLabel: {
    color: '#FFFFFF',
    fontSize: 11
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 14
  },
  mBottom: {
    marginBottom: 16
  },
  languageContent: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  language: {
    backgroundColor: '#666',
    borderRadius: 50,
    marginRight: 16,
    marginTop: 8
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
    padding: 5,
    paddingHorizontal: 10
  },
  cameraClose: {
    marginTop: 20,
    marginLeft: 20
  },
  cameraShot: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center'
  }
});
