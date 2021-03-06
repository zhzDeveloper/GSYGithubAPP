/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'

const getTrend = (page = 0, since = 'daily', languageType, callback) => async (dispatch, getState) => {
    let res = await RepositoryDao.getTrendDao(page, since, languageType);
    if (res && res.result) {
        if (page === 0) {
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: res.data
            });
        } else {
            let trend = getState()['repository'].trend_repos_data_list;
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: trend.concat(res.data)
            });
        }
        callback && callback(res.data);
    } else {
        callback && callback(null);
    }
};

const searchRepository = async (q, language, sort, order, page = 1, pageSize) => {
    if (language) {
        q = q + `%2Blanguage%3A${language}`;
    }
    let res = await RepositoryDao.searchRepositoryDao(q, sort, order, page, pageSize);
    return {
        result: res.result,
        data: res.data
    }
};

const getUserRepository = async (userName, page = 1) => {
    let res = await RepositoryDao.getUserRepositoryDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getStarRepository = async (userName, page = 1) => {
    let res = await RepositoryDao.getStarRepositoryDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getRepositoryDetail = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryDetailDao(userName, reposName);
    return {
        result: res.result,
        data: res.data
    }
};


export default {
    getTrend,
    searchRepository,
    getUserRepository,
    getStarRepository,
    getRepositoryDetail,

}
