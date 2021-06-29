import React, { useState } from 'react'
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style'
import CustomButton from '../controls/custombutton'

const db = SQLite.openDatabase({name:'mydata'})

const AgregarScreen = function({ navigation }) {
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')

    const btnAgregarOnPress = function() {
        console.log({nombre, telefono})
        if (!nombre) {
            Alert.alert('Favor de poner el nombre');
            return;
        }
        if (!telefono) {
            Alert.alert('Favor de poner el teléfono');
            return;
        }

        db.transaction(function(t) {
            t.executeSql("INSERT INTO contactos (id_contacto, nombre, telefono) VALUES (null,?,?)",
                [nombre, telefono],
                function(tx, res) {
                    console.log(res)
                    Alert.alert('Contacto guardado satisfactoriamente')
                    navigation.goBack()
                },
                error => console.log({error})
            );
        });
    }

    return (
        <SafeAreaView>
            <View style={style.form}>
                <Text>Nombre</Text>
                <TextInput style={style.textInput} value={nombre} onChangeText={t => setNombre(t)} />
                <Text>Teléfono</Text>
                <TextInput style={style.textInput} value={telefono} onChangeText={t => setTelefono(t)} />
                <CustomButton title="Agregar" onPress={btnAgregarOnPress} />
            </View>
        </SafeAreaView>
    )
}

export default AgregarScreen;