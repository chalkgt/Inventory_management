'use client'
import Image from "next/image";
import { useState, useEffect } from "react";  
import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
  },
});

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8e24aa 30%, #e91e63 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
}));

const InventoryHeader = styled(Box)(({ theme }) => ({
  width: '800px',
  height: '100px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '2px solid #8e24aa',
  borderTop: '2px solid #8e24aa',
}));

const InventoryItem = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(5),
  boxShadow: '0 8px 16px rgba(142, 36, 170, 0.3)',
  borderLeft: '2px solid #8e24aa',
  borderRight: '2px solid #8e24aa',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8e24aa 30%, #e91e63 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(142, 36, 170, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
    boxShadow: '0 4px 6px 2px rgba(142, 36, 170, .5)',
  },
}));

// Move Firebase initialization inside a function
function initializeFirebase() {
  const firebaseConfig = {
    // Your Firebase configuration object
  };

  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [firestore, setFirestore] = useState(null);

  useEffect(() => {
    // Initialize Firebase when the component mounts
    const db = initializeFirebase();
    setFirestore(db);
    
    // Update inventory after Firebase is initialized
    if (db) {
      updateInventory(db);
    }
  }, []);

  const updateInventory = async (db) => {
    if (!db) return;
    const snapshot = query(collection(db, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({...doc.data(), name: doc.id})
    })
    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    if (!firestore || !item) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1});
      }
    }
    await updateInventory(firestore);
  }

  const addItem = async (item) => {
    if (!firestore || !item) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const {quantity} = docSnap.data();
        await setDoc(docRef, {quantity: quantity + 1});
      }
      else {
        await setDoc(docRef, {quantity: 1});
    }
    await updateInventory(firestore);
  }

  return( 
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 2,
        bgcolor: 'background.default',
      }}>
        <Box sx={{ 
          width: '800px', 
          padding: 2, 
          marginBottom: 2, 
          backgroundColor: 'background.paper',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(142, 36, 170, 0.5)',
          border: '2px solid #8e24aa',
        }}>
          <GradientText variant="h6" mb={2}>Add Item</GradientText>
          <Stack direction="row" spacing={2}>
            <TextField 
              variant="outlined" 
              fullWidth 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)}
            />
            <GradientButton 
              variant="contained" 
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName);
                  setItemName('');
                }
              }}
            >
              Add
            </GradientButton>
          </Stack>
        </Box>
        <Box sx={{ border: '2px solid #8e24aa', borderRadius: '4px', overflow: 'hidden' }}>
          <InventoryHeader>
            <Typography variant="h2" color="#8e24aa">
              Inventory Items
            </Typography>
          </InventoryHeader>
        </Box>
        <Stack sx={{ 
          width: '800px', 
          height: '300px', 
          spacing: 2, 
          overflow: 'auto',
          boxShadow: '0 0 20px rgba(142, 36, 170, 0.5)',
          borderRadius: '4px',
        }}>
          {inventory.map((item) => (
            <InventoryItem key={item.name}>       
              <Typography variant="h3" color="text.primary" textAlign="center">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="h3" color="text.primary" textAlign="center">
                {item.quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <GradientButton variant="contained" onClick={() => addItem(item.name)}>Add</GradientButton>
                <GradientButton variant="contained" onClick={() => removeItem(item.name)}>Remove</GradientButton>
              </Stack>
            </InventoryItem>
          ))}
        </Stack>
      </Box>
    </ThemeProvider>
  )
}