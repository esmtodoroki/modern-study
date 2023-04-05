import doGet from './functions/doGet'
import sample from './functions/sample'
import { USER_NAME, PASSWORD, URL } from './functions/common/dbParam'
import readTableSub from './functions/common/readTableSub'
import readBookTableAll from './functions/readBookTableAll'
import readGenreTable from './functions/readGenreTable'
import insertNewBook from './functions/insertNewBook'
import deleteBook from './functions/deleteBook'

global.doGet = doGet
global.sample = sample
global.readTableSub = readTableSub
global.readBookTableAll = readBookTableAll
global.readGenreTable = readGenreTable
global.insertNewBook = insertNewBook
global.deleteBook = deleteBook
