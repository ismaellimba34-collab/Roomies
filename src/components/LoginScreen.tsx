import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type AuthError,
} from 'firebase/auth';

import { auth } from '../lib/firebase';
import { colors } from '../theme/colors';

type Modo = 'login' | 'registro';

const MENSAJES_ERROR: Record<string, string> = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/missing-password': 'Ingresá una contraseña.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña tiene que tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Probaste demasiadas veces. Esperá un rato y volvé a intentar.',
  'auth/network-request-failed': 'No hay conexión a internet. Revisá tu wifi o datos.',
};

function traducirError(error: unknown): string {
  const code = (error as AuthError)?.code;
  if (code && MENSAJES_ERROR[code]) return MENSAJES_ERROR[code];
  return 'Algo salió mal. Probá de nuevo en un momento.';
}

export default function LoginScreen() {
  const [modo, setModo] = useState<Modo>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esRegistro = modo === 'registro';

  async function handleSubmit() {
    setError(null);

    if (!email.trim() || !password) {
      setError('Completá email y contraseña.');
      return;
    }

    setCargando(true);
    try {
      if (esRegistro) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(traducirError(err));
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo() {
    setError(null);
    setModo(esRegistro ? 'login' : 'registro');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>RoomieCBA</Text>
      <Text style={styles.subtitulo}>
        {esRegistro
          ? 'Creá tu cuenta para empezar a buscar roomie'
          : 'Iniciá sesión para seguir buscando roomie'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!cargando}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!cargando}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={handleSubmit}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.botonTexto}>{esRegistro ? 'Crear cuenta' : 'Ingresar'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={cambiarModo} disabled={cargando}>
          <Text style={styles.link}>
            {esRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    color: colors.accent,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
  },
  error: {
    color: colors.accent,
    fontSize: 14,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    color: colors.gold,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
