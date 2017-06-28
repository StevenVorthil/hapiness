import { suite, test } from 'mocha-typescript';
import { Observable, SubscribableOrPromise } from 'rxjs/Observable';
import { ConsumerType } from 'tslint/lib';
import * as unit from 'unit.js';
import { Hapiness, HapinessModule, Injectable, OnStart, OnRegister, OnError, Lib } from '../../src/core';

@suite('Integration - Core')
class CoreIntegration {

    @test('HapinessModule')
    test1(done) {

        @HapinessModule({
            version: '1.0.0'
        })
        class ModuleTest implements OnStart {
            onStart() {
                unit.string(Hapiness['module'].name)
                    .is('ModuleTest');
                done();
            }
        }

        Hapiness.bootstrap(ModuleTest);
    }

    @test('HapinessModule - DI')
    test2(done) {

        @Injectable()
        class Service1 {
            getData() {
                return 'test';
            }
        }

        @HapinessModule({
            version: '1.0.0',
            providers: [ Service1 ]
        })
        class ModuleTest implements OnStart {

            constructor(private service: Service1) {}

            onStart() {
                unit.string(this.service.getData())
                    .is('test');
                done();
            }
        }

        Hapiness.bootstrap(ModuleTest);
    }

    @test('HapinessModule - SubModule')
    test3(done) {

        @Injectable()
        class Service1 {
            getData() {
                return 'test';
            }
        }

        @Injectable()
        class Service2 {
            getData() {
                return '123';
            }
        }

        @HapinessModule({
            version: '1.0.0',
            providers: [ Service2 ]
        })
        class SubSubModule implements OnRegister {

            constructor(private service: Service2) {}

            onRegister() {
                unit.string(this.service.getData()).is('123');
            }
        }

        @HapinessModule({
            version: '1.0.0',
            providers: [ Service2 ],
            exports: [ Service2 ],
            imports: [{ module: SubSubModule, providers: [] }]
        })
        class SubModule implements OnRegister {

            constructor(private service: Service2) {}

            onRegister() {
                unit.string(this.service.getData()).is('123');
            }
        }

        @HapinessModule({
            version: '1.0.0',
            providers: [ Service1 ],
            imports: [ SubModule ]
        })
        class ModuleTest implements OnStart {

            constructor(
                private service1: Service1,
                private service2: Service2
            ) {}

            onStart() {
                unit.string(this.service1.getData() + this.service2.getData())
                    .is('test123');
                done();
            }
        }

        Hapiness.bootstrap(ModuleTest);
    }

    @test('HapinessModule - Libs')
    test4(done) {

        @Injectable()
        class Service1 {
            getData() {
                return 'test';
            }
        }

        @Lib()
        class LibTest {
            constructor(private service: Service1) {
                unit.string(this.service.getData())
                    .is('test');
                done();
            }
        }

        @HapinessModule({
            version: '1.0.0',
            providers: [ Service1 ],
            declarations: [ LibTest ]
        })
        class ModuleTest {}

        Hapiness.bootstrap(ModuleTest);
    }

    @test('HapinessModule - Error')
    test5(done) {

        @HapinessModule({
            version: '1.0.0'
        })
        class ModuleTest implements OnError {

            onStart() {
                return Observable.create(observer => {
                    observer.error(new Error('error'));
                    observer.complete();
                });
            }

            onError(err) {
                unit.object(err)
                    .isInstanceOf(Error)
                    .hasProperty('message', 'error');
                done();
            }
        }

        Hapiness.bootstrap(ModuleTest).catch(_ => {});
    }
}