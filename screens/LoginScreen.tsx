import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [inputCode, setInputCode] = useState<string>(''); 

  const generateCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setInputCode(newCode); 
    alert(`Código gerado: ${newCode}`);
    await saveCodeToFirestore(newCode);  
    await AsyncStorage.setItem('accessCode', newCode);  
  };

  const saveCodeToFirestore = async (generatedCode: string) => {
    try {
      await setDoc(doc(db, "lobbies", generatedCode), {
        accessCode: generatedCode,
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o código no servidor');
    }
  };

  const handleLogin = async () => {
    try {
      const docRef = doc(db, "lobbies", inputCode); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await AsyncStorage.setItem('accessCode', inputCode);
        Alert.alert('Sucesso', 'Código válido! Entrando no lobby...');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'Código inválido!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao validar o código.');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Entre para acessar a plataforma de memórias afetivas.</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o código"
          value={inputCode}
          onChangeText={setInputCode}
          keyboardType="numeric"
          textAlign="center" 
        />

        <View style={styles.buttonContainer}>
          <Button title="Gerar Código" onPress={generateCode} color="#FFCC00" />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Entrar" onPress={handleLogin} color="#FFCC00" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20, 
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 28,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,

  },
});

export default LoginScreen;
