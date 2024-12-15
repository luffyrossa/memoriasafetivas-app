import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const UploadScreen = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadData = async () => {
    const formData = new FormData();
    formData.append("text", text);
  
    if (image) {
      const localUri = image;
      const filename = localUri.split("/").pop();
      const type = `image/${filename?.split(".").pop()}`;
  
      // Convertendo a imagem para Blob
      const response = await fetch(localUri);
      const blob = await response.blob();
  
      formData.append("image", blob, filename);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconPlaceholder} />
        <Text style={styles.headline}>Headline</Text>
        <Text style={styles.supportingText}>supporting text</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
        <Text style={styles.publishedDate}>Published date</Text>
      </View>

      <Text style={styles.bodyText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu texto"
        value={text}
        onChangeText={setText}
      />
      <Button title="Escolher Imagem" onPress={pickImage} color="#B38B36" />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity onPress={uploadData} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E0E0E0",
    borderRadius: 50,
    marginBottom: 10,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  supportingText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: "#B38B36",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  publishedDate: {
    fontSize: 14,
    color: "#999",
  },
  bodyText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#B38B36",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UploadScreen;
