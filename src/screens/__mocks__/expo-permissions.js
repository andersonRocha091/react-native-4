import { Component } from 'react';

export const CAMERA = 'camera';

export const askAsync = jest.fn(() => Promise(resolve => resolve({ status: 'granted'})));
