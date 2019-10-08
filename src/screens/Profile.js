import React from 'react';
import moment from 'moment';
import {
  ActivityIndicator,
  Animated,
  AsyncStorage,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

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
    loading: false,
    hasCameraPermission: false,
    isOpenCamera: false,
    photo: null
  }

  async componentDidMount() {
    this.finishLoading()

    try {
      const photo = await AsyncStorage.getItem('userImage');

      this.setState({ photo })
    } catch(error) {
      console.error('Could not load the user image', error)
    }

    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      this.setState({ hasCameraPermission: status === 'granted' });
    } catch (error) {
      console.error('There was an error trying to get the user permission', error)
    }
  }

  finishLoading = async () => {
    try {
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start()
    } catch (error) {
      console.error(error)
    }
  }

  togglleCamera = async () => {
    if (this.state.hasCameraPermission) {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        if (status !== 'granted') {
          return
        }

        this.setState({ hasCameraPermission: true });
      } catch (error) {
        console.error('There was an error trying to get the user permission', error)
        return
      }
    }

    Animated.timing(this.fadeAnimation, {
      toValue: this.state.isOpenCamera ? 1 : 0,
      duration: 600,
      useNativeDriver: true
    }).start()

    this.setState({
      isOpenCamera: !this.state.isOpenCamera
    })
  }

  takePicture = async () => {
    if (window.camera) {
      const photo = await window.camera.takePictureAsync({ base64: true });

      try {
        await AsyncStorage.setItem('userImage', photo ? `data:image/jpg;base64,${photo.base64}` : '');
      } catch (error) {
        console.error('Error saving the image', error)
      }

      this.setState({ photo: photo ? `data:image/jpg;base64,${photo.base64}` : '' });
      this.togglleCamera();
    }
  }

  render() {

    if (this.state.isOpenCamera) {
      return (
        <Camera className="camera-container" ref={ref => window.camera = ref} style={styles.camera}>
          <StatusBar className="status-bar" hidden />
          <View style={styles.cameraContent}>
            <TouchableOpacity className="camera-close" onPress={this.togglleCamera}>
              <Text style={styles.cameraClose}>X</Text>
            </TouchableOpacity>
            <View style={styles.shotContainer}>
              <TouchableOpacity className="camera-shot" onPress={this.takePicture}>
                <Text style={styles.cameraShot}>Tirar foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            className="header-image"
            style={styles.headerImage}
            source={{uri: 'https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png'}}
          />
        </View>
        {this.state.loading && (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#7800ff" />
          </View>
        )}
        {!this.state.loading && (
          <ScrollView>
            <View style={styles.profileTitle}>
              <TouchableOpacity className="profile-image-btn" onPress={this.togglleCamera}>
                <Image
                  className="profile-image"
                  style={styles.profileImage}
                  source={{uri: this.state.photo ? this.state.photo : profile.picture }}
                />
              </TouchableOpacity>
              <Text className="profile-name" style={styles.profileName}>{profile.name}</Text>
            </View>
            <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
                <Text className="contact-label" style={styles.contentLabel}>Linkedin:</Text>
                <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.linkedin}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Github:</Text>
                <Text className="contact-value" style={styles.contentText}>{profile.github}</Text>
            </Animated.View>
            <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
                <Text className="contact-label" style={styles.contentLabel}>E-mail:</Text>
                <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.email}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Celular:</Text>
                <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.phone}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Data de Nascimento:</Text>
                <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>
                  {moment(profile.birthday).format('DD/MM/YYYY')}
                </Text>

                <Text className="contact-label" style={styles.contentLabel}>Sexo:</Text>
                <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>
                  {profile.gender === 1 ? 'Masculino' : 'Feminino'}
                </Text>

                <Text className="contact-label" style={styles.contentLabel}>Idiomas:</Text>
                <View style={styles.languageContent}>
                  {profile.language.map(language => (
                    <View key={language} style={styles.language}>
                      <Text className="contact-language" style={styles.languageText}>
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
  camera: {
    flex: 1
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cameraClose: {
    color: '#FFF',
    fontSize: 24,
    marginTop: 10,
    marginLeft: 16
  },
  cameraShot: {
    color: '#FFF',
    fontSize: 24,
  },
  shotContainer: {
    flex: 1,
    alignContent: 'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
