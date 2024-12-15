import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert, Keyboard, TouchableWithoutFeedback, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [posts, setPosts] = useState<{ imageUri?: string; text?: string }[]>([]);
  const [textInput, setTextInput] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveImageToGallery = async (uri: string) => {
    try {
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert("Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar a imagem.");
    }
  };

  const deleteImage = (uri: string) => {
    if (uri === imageUri) {
      setImageUri(null); // Exclui a imagem da seleção
    } else {
      // Excluir a imagem postada (não aplicada no banco de dados, apenas no feed local)
      setPosts(posts.filter(post => post.imageUri !== uri));
    }
  };

  const addPost = async () => {
    if (!textInput.trim() && !imageUri) {
      Alert.alert("Aviso", "Adicione um texto ou imagem para criar um post!");
      return;
    }

    if (!codeInput.trim()) {
      Alert.alert("Aviso", "Digite um código de lobby para postar!");
      return;
    }

    try {
      const postsCollection = collection(db, "lobbies", codeInput, "postagens");
      await addDoc(postsCollection, {
        text: textInput.trim(),
        imageUri,
        createdAt: new Date(),
      });

      // Limpar os campos após o post ser enviado
      setTextInput("");
      setImageUri(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o post.");
    }
  };

  const loadPosts = async () => {
    const storedCode = await AsyncStorage.getItem('accessCode');
    if (storedCode) {
      setCodeInput(storedCode);
      try {
        const querySnapshot = await getDocs(collection(db, "lobbies", storedCode, "postagens"));
        const postsData = querySnapshot.docs.map(doc => doc.data());
        setPosts(postsData);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar os posts.");
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, []); 

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headline}>Feed</Text>
          <Text style={styles.subText}>Compartilhe suas memórias</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>Selecionar Imagem</Text>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.selectedImageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={styles.selectedImage}
            />
            <Text style={styles.imageSelectedText}>Imagem Selecionada</Text>
            <View style={styles.imageActions}>
              <TouchableOpacity onPress={() => saveImageToGallery(imageUri)} style={styles.imageActionButton}>
                <Text style={styles.imageActionText}>Salvar na Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteImage(imageUri)} style={styles.imageActionButton}>
                <Text style={styles.imageActionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Escreva algo..."
          value={textInput}
          onChangeText={setTextInput}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={addPost}
          >
            <Text style={styles.buttonText}>Postar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subText}>Postagens</Text>

        <View>
          {posts.map((post, index) => (
            <View key={index} style={styles.post}>
              {post.imageUri && (
                <View>
                  <Image source={{ uri: post.imageUri }} style={styles.postImage} />
                  <View style={styles.imageActions}>
                    <TouchableOpacity onPress={() => saveImageToGallery(post.imageUri)} style={styles.imageActionButton}>
                      <Text style={styles.imageActionText}>Salvar na Galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteImage(post.imageUri)} style={styles.imageActionButton}>
                      <Text style={styles.imageActionText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Text style={styles.postText}>{post.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFCC00",
  },
  subText: {
    fontSize: 24,
    padding: 10,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFCC00",
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 28,
    textAlign: "center",
  },
  selectedImageWrapper: {
    marginBottom: 16,
    alignItems: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imageSelectedText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  imageActionButton: {
    backgroundColor: "#FFCC00",
    padding: 10,
    borderRadius: 8,
  },
  imageActionText: {
    color: "#FFF",
    fontSize: 16,
  },
  textInput: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 25,
    marginBottom: 20,
  },
  post: {
    marginBottom: 16,
    padding: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  postImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    marginBottom: 8,
  },
  postText: {
    fontSize: 18,
    color: "#333",
    padding: 15,
  },
  buttons: {
    marginTop: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
