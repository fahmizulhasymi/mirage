import {describe, it, beforeEach, expect, async, inject, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {TestComponentBuilder, MockXHR} from '@angular/compiler/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {provide} from '@angular/core';
import {QueryStringQuery} from './query_string.query';
import {AppbaseService} from '../../../shared/appbase.service';
import { HTTP_PROVIDERS, JSONP_PROVIDERS, XHRBackend, Response, ResponseOptions} from '@angular/http';


describe('Query string format', () => {
    // Set initial things
    // set expected query format
    var query: QueryStringQuery;
    var expectedFormat = {
        'query_string': {
            'query': 'test_foobar',
            'fields': ['name']
        }
    };
    var expectedFormatWithOption = {
        'query_string': {
            'query': 'test_foobar',
            'fields': ['name', 'gender', 'eyeColor']
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new QueryStringQuery();
        query.queryName = 'query_string';
        query.fieldName = 'name';
        query.inputs = {
            input: {
                value: 'test_foobar'
            }
        };
    });
    beforeEachProviders(() => {
        return [
          HTTP_PROVIDERS,
          AppbaseService
        ];
    });




    function isValidJson(str: string) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    
    // Test to check if queryformat is valid json
    it('is valid json', () => {
        var format = query.setFormat();
        var validJson = isValidJson(JSON.stringify(format));
        expect(validJson).toEqual(true);
    });

    // Test to check if result of setformat is equal to expected query format.
    it('Is setformat matches with expected query format', () => {
        var format = query.setFormat();
        expect(format).toEqual(expectedFormat);
    });


    // Test to check if result of setformat is equal to expected query format with option.
    it('Is setformat matches with expected query format when pass options with query', () => {
        query.optionRows = [{
            name: 'fields',
            value: 'gender,eyeColor'
        }];
        var format = query.setFormat();
        expect(format).toEqual(expectedFormatWithOption);
    });
})

declare var $;
describe("xhr test (query_string)", function () {
    var returnedJSON = {};
    var status = 0;

    beforeEach(function (done) {
        var query = new QueryStringQuery();
        query.queryName = 'query_string';
        query.fieldName = 'name';
        query.inputs = {
            input: {
                value: 'test_foobar'
            }
        };
        var config = {
            url: 'https://scalr.api.appbase.io',
            appname: 'mirage_test',
            username: 'wvCmyBy3D',
            password: '7a7078e0-0204-4ccf-9715-c720f24754f2'
        };
        var url = 'https://scalr.api.appbase.io/mirage_test/test/_search';
        var query_data = query.setFormat();
        var request_data = {
            "query": {
                "bool": {
                    "must": [query_data]
                }
            }
        };
        $.ajax({
            type: 'POST',
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Basic " + btoa(config.username + ':' + config.password));
            },
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(request_data),
            xhrFields: {
                withCredentials: true
            },
            success: function(res) {
                returnedJSON = res;
                status = 200;
                done();
            },
            error: function(xhr) {
                returnedJSON = res;
                status = xhr.status;
                done();
            }
        });
    });

    it("Should have returned JSON and Should have atleast 1 record", function () {
        expect(returnedJSON).not.toEqual({});
        expect(returnedJSON).not.toBeUndefined();
        expect(status).toEqual(200);
        expect(returnedJSON.hits.hits.length).toBeGreaterThan(0);
    });

});