import IngredientsTable from '@/components/UI/tables/ingredients';
import IngredientForm from '@/forms/lingredient.form';

const Ingredients = () => {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  );
};

export default Ingredients;
