'use client'
import Image from "next/image"
import { ChangeEvent, useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore"

/*import { DeleteIcon } from '@mui/icons-material/Delete'*/

export default function Home() {
  /* STATE VARIABLES */
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  /*  UPDATE PANTRY */
  const updatePantry = async () => {
    /* `async` is a keyword that is used to declare a function that returns a Promise
      A Promise is a result object that is used to handle asynchronous operations. 
      ---
      In this function, the `async` keyword is used to indicate that the function will
      perform an asynchronous operation: Fetch data from the Firestore database. */
    const pantryRef = collection(firestore, 'pantry')
    const q = query(pantryRef,
      where("name", ">=", searchQuery),
      where("name", "<=", searchQuery + "\uf8ff"));
      
    const querySnapshot = await getDocs(q)
    const pantryList = []
    querySnapshot.forEach((doc) => {
      if (doc.data().name !== undefined) {
          PantryList[doc.data().name] = doc.data().quantity || 0;
        }
    });
    setPantry(pantryList);
    
    /* Do i keep this part under this comment? */
    pantryDocs.forEach((pantryDoc) => {
      /* Loop through each document that was retrieved from the `pantry`. */
      pantryList.push({
        name: pantryDoc.id,
        ...pantryDoc.data(),
      })
      /* Extract the data from each document, and push it to the array. */
    })
    setPantry(pantryList);
    /* Update the `pantry` state variable with the new `pantryList` array. */
  }


  /*  ADD ITEM */
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    /* Create a reference to a document in the `pantry` collection of the Firestore database.
      The `item` parameter is used as the ID of the document */
    const docSnap = await getDoc(docRef)
    /* Use the `getDoc` method to retrieve the document snapshot from the Firestore database. 
      The `await` keyword is used to wait for the promise to resolve. */
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      /* Extract the `quantity` field from the document data */
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updatePantry()
  }
 

  /*  REMOVE ITEM */
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updatePantry()
  }


  /* DELETE ITEM */
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updatePantry()
  }


  useEffect(() => { updatePantry() }, [searchQuery]);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
    > 
      <Typography variant="h2">Pantry Manager</Typography>
      <TextField
        sx={{width: 800}}
        variant="outlined"
        label="Search Pantry"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          height={350}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" fontFamily="Space Mono">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => { addItem(itemName); setItemName(''); handleClose() }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => { handleOpen() }}>Add New Item</Button>
      <Box id="display-box"> 
        <Box
          id="display-header"
          width="100%"
          height="50px"
          borderRadius={1}
          padding="0 10px"
          bgcolor="#223040"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="#fff" sx={{flexBasis: '40%'}}>Items</Typography>
          <Typography variant="h6" color="#fff" sx={{flexBasis: '40%'}}>Quantity</Typography>
          <Typography variant="h6" color="#fff" sx={{flexBasis: '20%'}}>Edit</Typography>
        </Box>
        <Stack
          id="list-items-container"
          width="800px"
          height="300px"
          border={3}
          borderTop={0}
          borderRadius={1.5}
          borderColor="#223040"
          padding="8px 0 8px 0"
          display="flex"
          flexDirection="column"
          alignItems="center"
          bgcolor="#d9e4e9"
          spacing={1}
          overflow="auto"
          sx={{
            '&::-webkit-scrollbar': {
              display: "none",
            },
            /*'&::-webkit-scrollbar-thumb': {
              backgroundColor: '#000',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#fff',
                borderRadius: '10px',
            },
            */
          }}>
          {pantry.map(({ name, quantity }) => (
            <Box
              id="list-items"
              key={name}
              width="97%"
              height="50px"
              borderRadius={2}
              padding={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#6b7b8c"
            >
              <Typography variant="p" color="#fff" textAlign="center" sx={{flexBasis: '40%'}}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="p" color="#fff" textAlign="center" sx={{flexBasis: '40%'}}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{flexBasis: '20%'}}>
                <Button variant="contained" onClick={() => { addItem(name) }}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => { removeItem(name) }}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
