import { useEffect, useState } from 'react';
import styled from 'styled-components'
import SearchResult from './components/SearchResult';

export const BASE_URL = "http://localhost:9000"

const App = () => {

  const filterBtns = [
    {
      name: "All",
      type: "all"
    },
    {
      name: "Breakfast",
      type: "breakfast"
    },
    {
      name: "Lunch",
      type: "lunch"
    },
    {
      name: "Dinner",
      type: "dinner"
    }
  ]
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBtn, setSelectedBtn] = useState("all")

  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true)
  
      try {
        const response = await fetch(BASE_URL)
        
        const json = await response.json()
  
        setData(json)
        setFilteredData(json)
        setLoading(false)
      } catch (error) {
        setError("Unable to fetch data.")
      }
    }
    fetchFoodData()
  }, [])

  const searchFood = (e) => {
    const searchValue = e.target.value

    if(searchValue === "") {
      setFilteredData(null)
    }

    const filter = data?.filter((food) => 
      food.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    setFilteredData(filter)
  }

  const filterFood = (type) => {
    if(type === "all") {
      setFilteredData(data)
      setSelectedBtn("all")
      return
    }

    const filter = data?.filter((food) => 
      food.type.toLowerCase().includes(type.toLowerCase())
      )
      setFilteredData(filter)
      setSelectedBtn(type)
  }

  if(error) return <div>{error}</div>
  if(loading) return <div>Loading...</div>

  return (
    <>
      <Container>
        <TopContainer>
          <div className="logo">
            <img src="/logo.svg" alt="Logo" />
          </div>

          <div className="search">
            <input onChange={searchFood} placeholder="Search Food..." />
          </div>
        </TopContainer>

        <FilterContainer>
          {filterBtns.map(({ name, type }) => (
            <Button isSelected={selectedBtn == type} onClick={() => filterFood(type)} key={name}>{name}</Button>
            ))}
        </FilterContainer>
      </Container>
      <SearchResult data={filteredData} />
    </>
  )
};

export default App;

export const Container = styled.div `
  max-width: 1200px;
  margin: 0 auto;
`

const TopContainer = styled.section `
  height: 140px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  align-items: center;

  .search {
    input {
      background-color: transparent;
      border: 1px solid red;
      color: white;
      border-radius: 5px;
      height: 40px;
      width: 285px;
      font-size: 16px;
      padding: 0 10px;
      outline: none;

      &::placeholder {
        color: white;
      }
    }
  }

  @media (0 < width < 600px) {
    flex-direction: column;
    height: 120px;
  }
`

const FilterContainer = styled.section `
  display: flex;
  justify-content: center;
  gap: 14px;
  padding-bottom: 29px;
`

export const Button = styled.button `
  background: ${({ isSelected }) => (isSelected ? "#ff1f1f" : "#FF4343")};
  outline: 1px solid ${({ isSelected }) => (isSelected ? "#ffffff" : "#FF4343")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  transition: 0.4s ease-in;

  &:hover {
    background: #ff1f1f;
    transition: 0.3s ease-in;
  }
`