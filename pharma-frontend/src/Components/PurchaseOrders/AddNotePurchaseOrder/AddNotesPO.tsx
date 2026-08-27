import * as React from "react";
import Grid from "@mui/material/Grid";

import { useDeleteOrderNote } from "Hooks/useOrders";
import { OrderNote } from "Interfaces/Order";
import OrderNotes from "Components/TakeOrder/OrderNotes/OrderNotes";
import { useCreateOrderNote, useNotes } from "Hooks/usePurchaseOrders";

interface Props {
  purchaseOrderID: string;
}

const OrderNotesContainer: React.FC<Props> = ({ purchaseOrderID }) => {
  const { data: notes } = useNotes(purchaseOrderID);

  const { mutate } = useCreateOrderNote(purchaseOrderID);
  const { mutate: deleteNoteById } = useDeleteOrderNote(purchaseOrderID);
  const publicNotes = notes?.results?.filter(note => note.type === "p") || [];
  const privateNotes = notes?.results?.filter(note => note.type === "v") || [];

  const deleteNote = (noteId: string) => {
    deleteNoteById({ noteId });
  };

  const addNote = async (note: Omit<OrderNote, "id" | "created">) => {
    mutate(note);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <OrderNotes
            type="Public"
            notes={publicNotes}
            onDelete={deleteNote}
            onAdd={addNote}
            // disabled={purchaseOrder.is_trash}
            disabled={false}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <OrderNotes
            type="Private"
            notes={privateNotes}
            onDelete={deleteNote}
            onAdd={addNote}
            // disabled={purchaseOrder.is_trash}
            // disabled={false}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderNotesContainer;
