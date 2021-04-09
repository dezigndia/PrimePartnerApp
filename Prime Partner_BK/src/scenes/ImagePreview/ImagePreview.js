import React from "react";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ImagePreview = ({ navigation }) => {
  const imageUri = navigation.getParam("imageUrl");
  console.log('imageUri', imageUri);
  return (
    <View style={styles.modalContentWrapper}>
      <View style={styles.modalHeaderWrapper}>
        <MaterialIcons
          onPress={() => navigation.navigate('CampaignList')}
          style={styles.backIcon}
          name="arrow-back"
          size={24}
          color="#522e90"
        />
        <Text style={styles.imagePreviewText}>Image Preview</Text>
        <View></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} style={styles.imageWrapper}>
        <Image style={styles.image} source={{uri: imageUri}} />
      </ScrollView>
    </View>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  modalContentWrapper: {
    flex: 1,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#fff",
  },
  modalHeaderWrapper: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    elevation: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  imagePreviewText: {
    color: "#522e90",
    fontSize: 18,
    fontWeight: "200",
    marginVertical: 8,
  },
  imageWrapper: {
    flex: 1,
    paddingVertical: 10,
  },
  scroll: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "90%",
    height: "90%",
    borderRadius: 5,
    resizeMode: "contain"
  },
  backIcon: {
    marginLeft: 12,
  },
});
