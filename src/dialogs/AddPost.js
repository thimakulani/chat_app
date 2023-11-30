import { View, Modal, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AddPost = ({ visible, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.background} onPress={onClose} />
                <View style={styles.dialog}>
                    <Text>Full Width & Height Dialog Content</Text>
                    {/* Your dialog content here */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
    },
    dialog: {
        backgroundColor: '#fff',
        width: '80%',
        maxHeight: '80%',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddPost;