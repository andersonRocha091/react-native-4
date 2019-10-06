# Utilizando APIs internas do React Native

## Tópicos
Com esse desafio, você aprenderá:

- Expo camera
- AsyncStorage

## Detalhes

Dentro da pasta src/screens, você encontrará a estrutura básica do teste e todos arquivos necessários de configuração já estão criados. Sua missão será criar tela conforme o exemplo do vídeo abaixo.

### Tarefas

1. Deve ser instalado o pacote `expo-camera` no projeto.
2. Deve ser colocar um botão envolta da foto de perfil do usuário com a classe `profile-image-btn`.
3. Ao clicar no botão deverá ser aberto o Objeto de Camera do `expo-camera`. A referencia do objeto(Camera) deverá ser atribuido a variável `camera` em `window`, podendo ser acessado da seguinte forma `window.camera`.
4. Camera
  - Quando a camera estiver ativa a barra de status deverá estar escondida com a classe `status-bar`.
  - Deverá ter um botão para fechar a camera com a classe `camera-close`.
  - Deverá ter um botão para tirar foto com a classe `camera-shot`.
  - A foto tirada deverá ser salva no `AsyncStorage` com o prefixo do base64 (`data:image/jpg;base64,`).
  - A foto tirada deverá ser mostrada na foto de perfil.
  - Ao fechar a camera os dados do usuário deverão ser apresentados novamente.
5. Reload
  - Quando recarregar a aplicação deverá ser apresentado a foto de perfil tirada pelo usuário que foi salva no `AsyncStorage`.

### Exemplo
![](https://codenation-challenges.s3-us-west-1.amazonaws.com/react-native-4/react-native-4.webm)

## Rodando a aplicação
Na primeira execução rodar o comando:
```
npm run android
```
Para rodar a aplicação:
```
npm start
```
