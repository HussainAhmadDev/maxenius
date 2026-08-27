import * as React from "react";
import Grid from "@mui/material/Grid";
import OrderNotes from "./OrderNotes";
import { useCreateOrderNote, useDeleteOrderNote } from "Hooks/useOrders";
import { OrderData, OrderNote } from "Interfaces/Order";

interface Props {
  order: OrderData;
}

const OrderNotesContainer: React.FC<Props> = ({ order }) => {
  const { mutate } = useCreateOrderNote(order.id);
  const { mutate: deleteNoteById } = useDeleteOrderNote(order.id);
  const publicNotes = order?.notes?.filter(note => note.type === "public") || [];
  const privateNotes = order?.notes?.filter(note => note.type === "private") || [];

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
            disabled={order.is_trash}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <OrderNotes
            type="Private"
            notes={privateNotes}
            onDelete={deleteNote}
            onAdd={addNote}
            disabled={order.is_trash}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderNotesContainer;
