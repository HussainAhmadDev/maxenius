import FridgeList from "../../../Pages/Fridges/Components/FridgesList";

const Fridges: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  return (
    <div>
      <FridgeList isTrash={isTrash} />
    </div>
  );
};

export default Fridges;
