import React, { useEffect } from "react";
import { styles } from "./Modal.style";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const ApproveModal = ({ navigation, isVisible, description, showCancel, handleIsVisible }) => {
  const [showModal, setShowModal] = React.useState(isVisible);

  useEffect(() => {
    console.log('in useEffect isVisible => ', isVisible);
    setShowModal(isVisible);
  }, [isVisible]);

  const handleCloseModal = (action) => {
    setShowModal(false);
    handleIsVisible(false);
    if (action === 'redirect') {
      navigation.navigate("CatalogueHistory");
    }
  }

  return (
    <Modal
      isVisible={showModal}
      avoidKeyboard={true}
      backdropOpacity={0.4}
      style={styles.modal}
      onBackButtonPress={() => {}}
      onBackdropPress={() => {}}
    >
      <View style={styles.container}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonRowWrapper}>
          {showCancel && (
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          )}
          <View style={styles.separator}></View>
          <TouchableOpacity
            onPress={() => handleCloseModal('redirect')}
            style={[styles.redirectButton, showCancel ? {} : {borderBottomLeftRadius: 8}]}
          >
            <Text style={styles.redirectButtonText}>REDEEM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ApproveModal;
