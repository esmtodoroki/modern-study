import doGet from './functions/doGet'
import sample from './functions/sample'
import { USER_NAME, PASSWORD, URL } from './functions/dbParam'
import readTableSub from './functions/readTableSub'
import readBookTableAll from './functions/readBookTableAll'
import readGenreTable from './functions/readGenreTable'

global.doGet = doGet
global.sample = sample
global.USER_NAME = USER_NAME
global.PASSWORD = PASSWORD
global.URL = URL
global.readTableSub = readTableSub
global.readBookTableAll = readBookTableAll
global.readGenreTable = readGenreTable
