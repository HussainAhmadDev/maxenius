import React from "react";
import { Card } from "../Card/Card";
import { OrderData } from "../../../../Interfaces/Orders";

interface CardsListProps {
  cards: OrderData[];

  onUpdateDone: (id: string) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, onUpdateDone }) => {
  return (
    <ul
      style={{
        position: "relative",
        overflow: "visible",
        listStyleType: "none",
        paddingLeft: 0
      }}
    >
      {cards?.map(oneCard => (
        <Card
          id={oneCard.id}
          oneCard={oneCard}
          onUpdateDone={onUpdateDone}
          key={oneCard.id}
        />
      ))}
    </ul>
  );
};
