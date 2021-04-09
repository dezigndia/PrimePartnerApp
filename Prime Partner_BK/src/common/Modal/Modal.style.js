import { color } from "d3";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: 'center',
    backgroundColor: "white",
    borderRadius: 8,
    paddingTop: 20,
  },
  modal: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
  },
  buttonRowWrapper: {
    width: '100%',
    height: 60,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
  },
  separator: {
    height: '100%',
    width: 1,
    backgroundColor: '#dcdcdc',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    lineHeight: 16,
    color: 'red',
  },
  redirectButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomRightRadius: 8,
  },
  redirectButtonText: {
    fontSize: 14,
    lineHeight: 16,
    color: 'green',
  },
  description: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
});
