import React from 'react';
import Profile from './Profile';
import renderer from 'react-test-renderer';
import { ActivityIndicator, AsyncStorage } from 'react-native';
import * as Permissions from './__mocks__/expo-permissions';
import { Camera } from 'expo-camera';

describe('Normal', () => {
  let permissionResponse = 'granted'
  let getItemResponse = 'photo'
  let cameraRef;

  beforeEach(() => {
    Permissions.askAsync.mockImplementation(() => Promise.resolve({status: permissionResponse}));

    AsyncStorage.getItem = jest.fn(() => Promise.resolve(getItemResponse));
    AsyncStorage.setItem = jest.fn(() => Promise.resolve());
    (() => renderer.create(
      <Camera ref={ref => cameraRef = ref} />
    ))()
  });

  it('Should try to load the user image by the async storage', () => {
    const spy = jest.spyOn(AsyncStorage, 'getItem')

    const instance = renderer.create(<Profile />).root;

    expect(spy).toHaveBeenCalledWith('userImage')
  });

  it('Should ask permission to access camera', done => {
    const spy = jest.spyOn(Permissions, 'askAsync')

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('camera')
      done();
    });
  });

  it('Should have a button wrapping the user profile image', done => {
    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(instance.findAllByProps({className: "profile-image-btn"}).length).toBe(1);

      done();
    })
  })

  it('Should have a camera element when click on profile image', done => {
    const instance = renderer.create(<Profile />).root;


    setTimeout(() => {
      expect(instance.findAllByProps({className: "camera-container"}).length).toBe(0);
      instance.findAllByProps({className: "profile-image-btn"})[0].props.onPress();

      setTimeout(() => {
        expect(instance.findAllByProps({className: "camera-container"}).length).toBe(2);
        done();
      }, 600)
    })
  })

  it('Should show the taked photo as the user photo', done => {
    const spy = jest.spyOn(AsyncStorage, 'setItem');

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(instance.findAllByType('Camera').length).toBe(0);
      instance.findAllByProps({className: "profile-image-btn"})[0].props.onPress();

      setTimeout(() => {
        window.camera.takePictureAsync = jest.fn(() => Promise.resolve({base64: getItemResponse}))

        const spy2 = jest.spyOn(window.camera, 'takePictureAsync');

        expect(instance.findAllByProps({className: "camera-shot"}).length).toBe(1);

        instance.findAllByProps({className: "camera-shot"})[0].props.onPress();
        setTimeout(() => {
          expect(spy2).toHaveBeenCalledWith({base64: true});

          setTimeout(() => {
            expect(spy).toHaveBeenCalledWith('userImage', 'data:image/jpg;base64,photo');
            expect(instance.findByProps({className: "profile-image"}).props.source.uri).toBe('data:image/jpg;base64,photo');
            done();
          }, 600)
        }, 600)
      }, 600)
    })
  })

  it('Should save the photo at AsyncStorage with the base64 predefinition after taking a photo', done => {
    const spy = jest.spyOn(AsyncStorage, 'setItem');

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(instance.findAllByType('Camera').length).toBe(0);
      instance.findAllByProps({className: "profile-image-btn"})[0].props.onPress();

      setTimeout(() => {
        window.camera.takePictureAsync = jest.fn(() => Promise.resolve({base64: getItemResponse}))

        const spy2 = jest.spyOn(window.camera, 'takePictureAsync');

        expect(instance.findAllByProps({className: "camera-shot"}).length).toBe(1);

        instance.findAllByProps({className: "camera-shot"})[0].props.onPress();
        setTimeout(() => {
          expect(spy2).toHaveBeenCalledWith({base64: true});

          setTimeout(() => {
            expect(spy).toHaveBeenCalledWith('userImage', 'data:image/jpg;base64,photo');
            done();
          }, 600)
        }, 600)
      }, 600)
    })
  })

  it('Should load the saved photo instead of the user default image', done => {
    const spy = jest.spyOn(AsyncStorage, 'getItem');

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('userImage');

      setTimeout(() => {
        expect(instance.findByProps({className: "profile-image"}).props.source.uri).toBe('photo');
        done();
      }, 600)
    }, 600)
  })

  it('Should load user default photo when there is no image saved', done => {
    const spy = jest.spyOn(AsyncStorage, 'getItem');
    getItemResponse = null;

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('userImage');

      setTimeout(() => {
        expect(instance.findByProps({className: "profile-image"}).props.source.uri).toBe('https://secure.gravatar.com/avatar/f50a9db56e231198af3507f10b5d5491?d=mm');
        done();
      }, 600)
    }, 600)
  })

  it('Should have a close button when camera is active', done => {
    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(instance.findAllByProps({className: "camera-container"}).length).toBe(0);
      instance.findAllByProps({className: "profile-image-btn"})[0].props.onPress();

      setTimeout(() => {
        instance.findAllByProps({className: "camera-close"})[0].props.onPress();
        expect(instance.findAllByProps({className: "camera-container"}).length).toBe(2);
        setTimeout(() => {
          expect(instance.findAllByProps({className: "camera-container"}).length).toBe(0);
          done();
        }, 600)
      }, 600)
    })
  })

  it('Should hide the status bar when camera is active', done => {
    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(instance.findAllByProps({className: 'status-bar'}).length).toBe(0);
      instance.findAllByProps({className: "profile-image-btn"})[0].props.onPress();

      setTimeout(() => {
        expect(instance.findAllByProps({className: 'status-bar'}).length).toBe(1);
        expect(instance.findAllByProps({className: 'status-bar'})[0].props.hidden).toBe(true);

        done();
      }, 600)
    })
  })
})
