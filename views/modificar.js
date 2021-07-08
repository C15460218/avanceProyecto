import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style';

const db = SQLite.openDatabase({name:'mydata'})

const ModificarScreen = function({ route, navigation})
{
    const id_suscripcion = route.params.id_suscripcion;
    const [nombre, setNombre] = useState('')
    const [monto, setMonto] = useState('')

    function setSuscripcion(_nombre, _monto) {
        setNombre(_nombre)
        setMonto(_monto)
    }

    useEffect(function() {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM suscripciones WHERE id_suscripcion = ?',
                [id_suscripcion],
                function(tx, result) {
                    if (result.rows.length == 0) {
                        Alert.alert("No existe la suscripcion para modificar");
                        navigation.goBack();
                        return;
                    }

                    let registro = result.rows.item(0)
                    setContacto(registro.nombre, registro.monto)
                }
            )
        })
    }, [])

    function onGuardarPress() {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE suscripciones SET nombre = ?, monto = ? WHERE id_suscripcion = ?',
                [nombre, monto, id_suscripcion],
                (tx, result) => {
                    if (result.rowsAffected.length === 0) {
                        Alert.alert('No se actualizaron los datos. Intente de nuevo')
                        return;
                    }
                    
                    Alert.alert('Datos actualizados correctamente')
                    navigation.goBack()
                },
                error => console.log(error)
            )
        })
    }

    return (
        <SafeAreaView>
            <View style={style.form}>
                <Text>Nombre</Text>
                <TextInput style={style.textInput} value={nombre} onChangeText={setNombre} />
                <Text>Monto</Text>
                <TextInput style={style.textInput} value={monto} onChangeText={setMonto} />
                <Button title="Guardar" onPress={onGuardarPress} />
            </View>
        </SafeAreaView>
    )
}

export default ModificarScreen;