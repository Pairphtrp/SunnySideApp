import { StyleSheet } from 'react-native';

// App color palette
export const colors = {
    primary: '#007aff',
    secondary: '#5ac8fa',
    background: '#f9f9f9',
    card: '#ffffff',
    text: {
        primary: '#333333',
        secondary: '#555555',
        light: '#666666',
    },
    detailBox: '#f5f7fa',
    divider: '#eeeeee',
    success: '#4cd964',
    error: '#ff3b30',
};

// Typography
export const typography = {
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    body: {
        fontSize: 16,
    },
    label: {
        fontSize: 14,
    },
};

// Shared styles
export const globalStyles = StyleSheet.create({
    // Layout
    screenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Cards
    card: {
        backgroundColor: colors.card,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
        backgroundColor: colors.card,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    // Weather display
    locationName: {
        fontSize: typography.header.fontSize,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.text.primary,
    },
    temperature: {
        fontSize: 72,
        fontWeight: '200',
        color: colors.text.primary,
    },
    description: {
        fontSize: 24,
        marginVertical: 10,
        textTransform: 'capitalize',
        color: colors.text.secondary,
    },

    // Weather display detail styles
    locationTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    currentTime: {
        fontSize: 16,
        color: colors.text.secondary,
        marginLeft: 10,
    },
    feelsLike: {
        fontSize: 16,
        color: colors.text.secondary,
        marginTop: 5,
        fontWeight: '400',
    },
    highLowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    highLowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    highLowText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text.primary,
        marginLeft: 2,
    },

    // Detail sections
    sectionTitle: {
        fontSize: typography.title.fontSize,
        fontWeight: '600',
        marginBottom: 20,
        color: colors.text.primary,
    },
    detailBoxesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailBox: {
        width: '48%',
        backgroundColor: colors.detailBox,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailLabel: {
        fontSize: typography.label.fontSize,
        color: colors.text.light,
        marginTop: 5,
    },
    detailValue: {
        fontSize: typography.subtitle.fontSize,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: 5,
    },

    // Status indicators
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.error,
        fontSize: 18,
        textAlign: 'center',
    },

    // Common UI components
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        margin: 20,
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: colors.text.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },

    // Location header styles
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
    },

    // Text styles
    subtitle: {
        fontSize: typography.subtitle.fontSize,
        fontWeight: typography.subtitle.fontWeight as any, // Cast needed for TS
        color: colors.text.primary,
        marginBottom: 4,
    },
});