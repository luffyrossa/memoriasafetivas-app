import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, AccessibilityInfo } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../types";

// Definindo o tipo da navegação
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const toggleText = () => setExpanded(!expanded);

  const toggleSectionText = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Função para contar o número de palavras em uma string
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  // Função para ajustar a leitura da tela
  const onPressReadMore = () => {
    AccessibilityInfo.announceForAccessibility(
      expanded ? "Text collapsed" : "Text expanded"
    );
    navigation.navigate("FullText", { text: "Texto completo aqui" });
  };

  // Função para abrir o conteúdo completo da seção
  const onPressSection = (item: number, description: string) => {
    const wordCount = countWords(description);
    if (wordCount > 15) {
      // Se a descrição tiver mais de 15 palavras, navegar para uma nova página
      navigation.navigate("FullText", { text: description });
    } else {
      // Caso contrário, alterna o estado de expansão da seção
      toggleSectionText(item);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headline} accessibilityRole="header">Headline</Text>
        <Text style={styles.subText} accessibilityRole="text" accessibilityHint="Supporting text to the headline">Supporting text</Text>

        {/* Descrição com acessibilidade para expandir e comprimir o texto */}
        <TouchableOpacity 
          onPress={toggleText}
          accessible={true}
          accessibilityLabel={expanded ? "Collapse text" : "Expand text"}
        >
          <Text style={styles.description} accessibilityRole="text">
            {expanded
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
          </Text>
        </TouchableOpacity>

        {/* Read More Button */}
        <TouchableOpacity 
          onPress={onPressReadMore}
          accessible={true}
          accessibilityLabel={expanded ? "Read less" : "Read more"}
        >
          <Text style={styles.readMore} accessibilityRole="button">
            {expanded ? "Read less" : "Read more"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seção de itens */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">Section title</Text>

        {[1, 2, 3].map((item, index) => {
          const description = `Description for item ${item}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...`; // Adicione uma descrição longa para teste
          const wordCount = countWords(description); // Contar palavras

          return (
            <View key={index} style={styles.listItem}>
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.listImage}
                accessible={true}
                accessibilityLabel={`Image for item ${item}`}
              />
              <View style={styles.listText}>
                <TouchableOpacity 
                  onPress={() => onPressSection(item, description)} // Chama a função ao clicar no título da seção
                >
                  <Text 
                    style={styles.listTitle}
                    accessibilityRole="header"
                  >
                    Title {item}
                  </Text>
                </TouchableOpacity>
                {wordCount <= 15 && expandedSections[index] && ( // Mostra ou esconde a descrição dependendo do estado de expansão
                  <Text style={styles.listDescription} accessibilityRole="text">
                    {description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headline: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: "#333",
    lineHeight: 24,
  },
  readMore: {
    fontSize: 18,
    color: "#007BFF",
    marginTop: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 16,
  },
  listText: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF", // Para indicar que é clicável
  },
  listDescription: {
    fontSize: 16,
    color: "#666",
  },
});

export default HomeScreen;
