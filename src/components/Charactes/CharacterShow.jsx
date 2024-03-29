import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import CharacterCard from './CharacterCard';
import styles from '../../style';
import { Link } from 'react-router-dom';
import { DropDownLoader, Loader } from '../SkeltonLoading';

const CharacterShow = () => {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
    const [filterOptions, setFilterOptions] = useState({
        aliveOnly: false,
        species: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${currentPage}`);
                const data = await response.data.results;
                setCharacters(data);
                setFilteredCharacters(data);
                setTotalPages(response.data.info.pages);
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [currentPage]);

    useEffect(() => {
        applyFilters();
    }, [characters, filterOptions, searchTerm]);

    const applyFilters = () => {
        let filtered = characters.filter(character =>
            character.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterOptions.aliveOnly) {
            filtered = filtered.filter(character => character.status === 'Alive');
        }

        if (filterOptions.species) {
            filtered = filtered.filter(character => character.species === filterOptions.species);
        }

        setFilteredCharacters(filtered);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(!!value); // Open the dropdown when there is a search term
    };

    const handleFilterChange = (option, value) => {
        setFilterOptions({ ...filterOptions, [option]: value });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <h1 className="my-8 text-2xl font-bold text-center text-gray-300 md:text-4xl">Rick and Morty Characters</h1>
            <div className="relative flex-row justify-start mb-4 ml-4 md:flex">
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-900">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        className="w-auto px-4 py-2 pl-10 bg-gray-200 border border-gray-700 rounded-md text-slate-700 md:w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Search by character name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex justify-start mb-4 ml-0 md:ml-4">
                    <div className="flex items-center mr-4">
                        <input
                            type="checkbox"
                            id="aliveOnly"
                            checked={filterOptions.aliveOnly}
                            onChange={(e) => handleFilterChange('aliveOnly', e.target.checked)}
                            className="w-4 h-4 text-green-500 form-checkbox focus:ring-green-400"
                        />
                        <label htmlFor="aliveOnly" className="ml-2 text-gray-300">Alive Only</label>
                    </div>
                    <div className="flex items-center">
                        <select
                            value={filterOptions.species}
                            onChange={(e) => handleFilterChange('species', e.target.value)}
                            className="w-auto px-2 py-1 bg-gray-200 border border-gray-700 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Species</option>
                            <option value="Human">Human</option>
                            <option value="Mythological Creature">Mythological Creature</option>
                            <option value="Poopybutthole">Poopybutthole</option>
                            <option value="Humanoid">Humanoid</option>
                            <option value="Robot">Robot</option>
                            <option value="Disease">Disease</option>
                            <option value="Cronenberg">Cronenberg</option>
                            <option value="Animal">Animal</option>
                            <option value="unknown">unknown</option>
                        </select>
                    </div>
                </div>
                {showDropdown && (
                    <div className="absolute z-10 mt-16 overflow-x-auto overflow-y-auto bg-white rounded-md shadow-md w-72 h-96 text-slate-700 scrollbar-thin scrollbar-thumb-slate-500">
                        {/* Render suggestions here */}
                        {isLoading ? (
                            <DropDownLoader count={5} />
                        ) : (
                            filteredCharacters.map((character) => (
                                <Link
                                    to={`/characters/${character.id}`}
                                    key={character.id}
                                    className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    <img src={character.image} alt={character.name} className="object-cover w-12 h-12 rounded-full" />{character.name}
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
            {isLoading ? (
                <Loader count={9} />
            ) : (
                <div className="grid min-h-screen grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCharacters.map((character) => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                </div>
            )}
            <div className={`flex justify-between mx-4 ${styles.paddingY}`}>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-1/2 px-4 py-2 mr-2 text-xl text-white bg-green-500 rounded-2xl md:text-2xl disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="w-1/2 px-4 py-2 text-xl text-white bg-green-500 rounded-2xl md:text-2xl disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </>
    )
}

export default CharacterShow;
