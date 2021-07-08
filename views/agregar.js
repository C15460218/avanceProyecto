import React, { useState } from 'react'
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style'
// import CustomButton from '../controls/custombutton'

const db = SQLite.openDatabase({name:'mydata'})

const AgregarScreen = function({ navigation }) {
    const [nombre, setNombre] = useState('')
    const [monto, setMonto] = useState('')

    const btnAgregarOnPress = function() {
        console.log({nombre, monto})
        if (!nombre) {
            Alert.alert('Favor de poner el nombre');
            return;
        }
        if (!monto) {
            Alert.alert('Favor de poner el monto');
            return;
        }

        db.transaction(function(t) {
            t.executeSql("INSERT INTO suscripciones (id_suscripcion, nombre, monto) VALUES (null,?,?)",
                [nombre, monto],
                function(tx, res) {
                    console.log(res)
                    Alert.alert('Suscripcion guardada satisfactoriamente')
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
                <Text>Monto</Text>
                <TextInput style={style.textInput} value={monto} onChangeText={t => setMonto(t)} />
                <Button title="Agregar" onPress={btnAgregarOnPress} />
            </View>
        </SafeAreaView>
    )
}

export default AgregarScreen;